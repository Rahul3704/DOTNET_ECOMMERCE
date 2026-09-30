using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Models;
using ECommerceApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, JwtService jwt) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await db.Users.AnyAsync(x => x.Email == dto.Email.ToLower()))
        {
            return BadRequest("Email already registered");
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email.ToLower()
        };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, dto.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok(new
        {
            token = jwt.CreateToken(user),
            user = new { user.Id, user.Name, user.Email, user.Role }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await db.Users.SingleOrDefaultAsync(x => x.Email == dto.Email.ToLower());
        if (user == null ||
            new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, dto.Password) ==
            PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(new
        {
            token = jwt.CreateToken(user),
            user = new { user.Id, user.Name, user.Email, user.Role }
        });
    }
}
