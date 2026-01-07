using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ShopBackend.Models;

namespace ShopBackend.Services
{
    public class CartService
    {
        private readonly IMongoCollection<Cart> _cartCollection;

        // Constructor: Jab ye service start hogi, ye DB se connect karegi
        public CartService(IConfiguration config)
        {
            // AppSettings se connection string uthayega
            var connectionString = config["MongoConnection"];
            var databaseName = config["DatabaseName"];

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);

            // 'Carts' collection (folder) ke saath jud jayega
            _cartCollection = database.GetCollection<Cart>("Carts");
        }

        // 1. User ka Cart lane ke liye function
        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            // FindOne: UserId match karke data layega
            var cart = await _cartCollection.Find(c => c.UserId == userId).FirstOrDefaultAsync();

            // Agar cart nahi mila (New User), toh ek khali cart bhej denge
            return cart ?? new Cart { UserId = userId, Items = new List<CartItem>() };
        }

        // 2. Cart mein Item Add karne ka function
        public async Task AddToCartAsync(string userId, CartItem newItem)
        {
            // Pehle purana cart dhoondo
            var cart = await GetCartByUserIdAsync(userId);

            // Check karo: Kya ye product pehle se cart mein hai?
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == newItem.ProductId);

            if (existingItem != null)
            {
                // Agar hai, toh bas quantity badha do
                existingItem.Quantity += newItem.Quantity;
            }
            else
            {
                // Agar nahi hai, toh naya item list mein add karo
                cart.Items.Add(newItem);
            }

            // Database mein wapis save karo (Insert ya Update)
            if (cart.Id == null)
            {
                // Naya cart banega
                await _cartCollection.InsertOneAsync(cart);
            }
            else
            {
                // Purana update hoga
                await _cartCollection.ReplaceOneAsync(c => c.Id == cart.Id, cart);
            }
        }

        public async Task<bool> RemoveFromCartAsync(string userId, int productId)
        {
            // 1. User ka cart dhoondo (Database ya List se)
            // Note: Yahan wahi variable use karein jo aapne GetCartByUserIdAsync mein kiya tha.
            // Example ke liye main '_carts' use kar raha hu (Agar MongoDB hai toh logic alag hoga)

            // 1. Pehle Database se Cart mangwao (Humne upar wala function reuse kiya)
            var cart = await GetCartByUserIdAsync(userId);

            // Agar cart naya hai (matlab database mein nahi hai), toh delete kya karenge?
            if (cart.Id == null) return false;

            // 2. Cart mein wo item dhoondo
            var itemToRemove = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (itemToRemove == null) return false; // Item mila hi nahi

            // 3. Memory mein list se item hatao
            cart.Items.Remove(itemToRemove);

            // 4. IMPORTANT: Ab Database ko update karo (Save changes)
            await _cartCollection.ReplaceOneAsync(c => c.Id == cart.Id, cart);

            return true; // Delete successful

        }

    }
}