using MongoDB.Driver;
using ShopBackend.Models;

namespace ShopBackend.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orderCollection;

        // Constructor: Database connect karega
        public OrderService(IConfiguration config)
        {
            // Hum EXACTLY wahi tareeka use kar rahe hain jo CartService mein hai
            var connectionString = config["MongoConnection"];
            var databaseName = config["DatabaseName"];

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);

            // 'Orders' naam ki nayi table (collection) ban jayegi automatically
            _orderCollection = database.GetCollection<Order>("Orders");
        }

        // Feature 1: Order Save karna (Checkout ke waqt)
        public async Task CreateOrderAsync(Order order)
        {
            await _orderCollection.InsertOneAsync(order);
        }

        // Feature 2: User ke Orders nikalna (My Orders page ke liye)
        public async Task<List<Order>> GetOrdersByUserIdAsync(string userId)
        {
            // UserId match karo aur Date ke hisaab se naya pehle dikhao (Descending)
            return await _orderCollection
                         .Find(o => o.UserId == userId)
                         .SortByDescending(o => o.OrderDate)
                         .ToListAsync();
        }
    }
}