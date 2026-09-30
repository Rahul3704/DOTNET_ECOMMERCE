using System.Security.Claims;
using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Controllers;

[Authorize]
[ApiController]
[Route("api/orders")]
public class OrdersController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(CheckoutDto dto)
    {
        var cart = await db.CartItems
            .Include(x => x.Product)
            .Where(x => x.UserId == UserId)
            .ToListAsync();

        if (!cart.Any())
        {
            return BadRequest("Cart is empty");
        }

        if (cart.Any(x => x.Quantity > x.Product!.Stock))
        {
            return BadRequest("Insufficient stock");
        }

        var order = new Order
        {
            UserId = UserId,
            ShippingAddress = dto.ShippingAddress,
            TotalAmount = cart.Sum(x => x.Quantity * x.Product!.Price)
        };

        foreach (var item in cart)
        {
            item.Product!.Stock -= item.Quantity;
            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Price = item.Product.Price,
                Quantity = item.Quantity
            });
        }

        db.Orders.Add(order);
        db.CartItems.RemoveRange(cart);
        await db.SaveChangesAsync();

        return Ok(order);
    }

    [HttpGet("my")]
    public async Task<IActionResult> My()
    {
        var orders = await db.Orders
            .Include(x => x.Items)
            .Where(x => x.UserId == UserId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> All()
    {
        var orders = await db.Orders
            .Include(x => x.Items)
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> Status(int id, [FromBody] string status)
    {
        var order = await db.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.Status = status;
        await db.SaveChangesAsync();

        return Ok(order);
    }
}
