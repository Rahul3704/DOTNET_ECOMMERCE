using ECommerceApi.Models;
using Microsoft.AspNetCore.Identity;

namespace ECommerceApi.Data;
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Categories.Any())
        {
            var electronics = new Category { Name = "Electronics" }; var fashion = new Category { Name = "Fashion" }; var books = new Category { Name = "Books" };
            db.Categories.AddRange(electronics, fashion, books); db.SaveChanges();
            db.Products.AddRange(
                new Product { Name="Wireless Headphones", Description="Bluetooth over-ear headphones", Price=1999, Stock=25, CategoryId=electronics.Id, ImageUrl="https://picsum.photos/seed/headphones/600/400" },
                new Product { Name="Smart Watch", Description="Fitness and notifications smartwatch", Price=2499, Stock=15, CategoryId=electronics.Id, ImageUrl="https://picsum.photos/seed/watch/600/400" },
                new Product { Name="Classic T-Shirt", Description="Comfortable cotton t-shirt", Price=699, Stock=40, CategoryId=fashion.Id, ImageUrl="https://picsum.photos/seed/tshirt/600/400" },
                new Product { Name="Clean Code", Description="A practical software craftsmanship book", Price=799, Stock=20, CategoryId=books.Id, ImageUrl="https://picsum.photos/seed/book/600/400" }
            ); db.SaveChanges();
        }
        if (!db.Users.Any(x => x.Email == "admin@example.com"))
        {
            var hasher = new PasswordHasher<User>(); var admin = new User { Name="Admin", Email="admin@example.com", Role="Admin" };
            admin.PasswordHash = hasher.HashPassword(admin, "Admin@123"); db.Users.Add(admin); db.SaveChanges();
        }
    }
}
