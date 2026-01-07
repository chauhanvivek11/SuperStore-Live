using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ShopBackend.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // MongoDB ki Unique ID

        public string UserId { get; set; } // Kis user ka order hai

        // Hum poora item detail yahi save karenge taaki agar future mein
        // Product ka price change ho jaye, toh purane order history mein price change na ho.
        public List<CartItem> Items { get; set; } = new List<CartItem>();

        public decimal TotalAmount { get; set; } // Kitne paise ka bill hai

        public string Status { get; set; } = "Pending"; // Pending, Shipped, Delivered

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    }
}