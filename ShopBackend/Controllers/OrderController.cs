using Microsoft.AspNetCore.Mvc;
using ShopBackend.Models;
using ShopBackend.Services;

namespace ShopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        // Constructor: OrderService ko inject karega
        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // 1. Naya Order Place karna
        // URL: http://localhost:5164/api/order/place
        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            // Thodi safety: Check karo order khali toh nahi
            if (order == null || order.Items.Count == 0)
            {
                return BadRequest("Order is empty!");
            }

            // Order Date abhi ki set kar do
            order.OrderDate = DateTime.UtcNow;

            // Database mein save karo
            await _orderService.CreateOrderAsync(order);

            return Ok(new { message = "Order Placed Successfully", orderId = order.Id });
        }

        // 2. Apne Orders dekhna
        // URL: http://localhost:5164/api/order/myorders/user123
        [HttpGet("myorders/{userId}")]
        public async Task<IActionResult> GetMyOrders(string userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }
    }
}