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
[Route("api/cart")]
public class CartController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var items = await db.CartItems
            .Include(x => x.Product)
            .Where(x => x.UserId == UserId)
            .ToListAsync();

        return Ok(items.Select(x => new
        {
            x.Id,
            x.Quantity,
            product = x.Product,
            subtotal = x.Quantity * x.Product!.Price,
            total = items.Sum(i => i.Quantity * i.Product!.Price)
        }));
    }

    [HttpPost("{productId:int}")]
    public async Task<IActionResult> Add(int productId)
    {
        var product = await db.Products.FindAsync(productId);
        if (product == null)
        {
            return NotFound("Product not found");
        }

        var item = await db.CartItems
            .SingleOrDefaultAsync(x => x.UserId == UserId && x.ProductId == productId);

        if (item == null)
        {
            item = new CartItem
            {
                UserId = UserId,
                ProductId = productId,
                Quantity = 1
            };
            db.CartItems.Add(item);
        }
        else
        {
            item.Quantity++;
        }

        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateCartDto dto)
    {
        var item = await db.CartItems
            .SingleOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (item == null)
        {
            return NotFound();
        }

        if (dto.Quantity <= 0)
        {
            db.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = dto.Quantity;
        }

        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Remove(int id)
    {
        var item = await db.CartItems
            .SingleOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (item == null)
        {
            return NotFound();
        }

        db.CartItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
