namespace ECommerceApi.DTOs;
public record RegisterDto(string Name, string Email, string Password);

public record LoginDto(string Email, string Password);

public record ProductDto(string Name, string Description, 
decimal Price, int Stock, string ImageUrl, int CategoryId);

public record UpdateCartDto(int Quantity);

public record CheckoutDto(string ShippingAddress);
