using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace ShopBackend.Models
{
    public class Cart
    {
        [BsonId] // Ye batata hai ki ye MongoDB ki unique ID hai
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? UserId { get; set; } // Clerk wali User ID yahan aayegi


        // *** Ye Niche wali line add karni hai: ***
        public List<CartItem> Items { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {

        //ye new line add krni hai jis se userId ka ek nya column bn jayega db mei 
        public string UserId { get; set; } = string.Empty;
        public int ProductId { get; set; } // FakeStore API wala Product ID
        public string? Title { get; set; }
        public double Price { get; set; }
        public string? Image { get; set; } // Product Image URL
        public int Quantity { get; set; }
    }
}