using Microsoft.AspNetCore.Mvc;
using ShopBackend.Models;
using ShopBackend.Services;
using System.Threading.Tasks;
using ShopBackend.Models;

namespace ShopBackend.Controllers
{
    [Route("api/[controller]")] // URL banega: /api/cart
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        // Constructor injection: Service maang rahe hain
        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        // 1. GET: User ka Cart laane ke liye
        // URL: GET /api/cart/user_123
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            return Ok(cart);
        }

        // 2. POST: Item add karne ke liye
        // URL: POST /api/cart/add/user_123  //esmei humei chnage krne hai jis se ki db mei user id ka aage ka system ho cke

        [HttpPost("add/{userId}")]
        public async Task<IActionResult> AddToCart(string userId, [FromBody] CartItem item)
        {
            //url se aayi hui userid // URL se aayi hui 'userId' ko Item ke andar set karna zaroori hai
            // Taki Database mein save hote waqt pata chale ye kiska item hai
            item.UserId = userId; // yeline hai 


            await _cartService.AddToCartAsync(userId, item);
            return Ok(new { message = "Item added to cart!" });
        }




        //3. DELETE item from cart 
        [HttpDelete("remove/{userId}/{productId}")]
        public async Task<IActionResult> RemoveFromCart(string userId, int productId)
        {
            // Hum direct logic nahi likhenge, hum Service ko bolenge remove karne ko
            var result = await _cartService.RemoveFromCartAsync(userId, productId);

            if (!result)
            {
                return NotFound("Item Or Cart not Found");
            }

            return Ok(new { message = " Item Removed Succssfully " });

        }
    }
}