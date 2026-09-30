# DotNetEcommerce — reverse-engineering practice project

A small but functional ASP.NET Core + EF Core + SQL Server + JWT + React ecommerce app.

## Features
- Register/login with JWT
- Product listing, search, detail
- Admin product CRUD
- Categories
- User cart: add/update/remove
- Checkout with stock validation
- Order creation and order history
- Admin order/status endpoints
- Swagger API documentation

## Backend setup
1. Open `backend` in VS Code.
2. Make sure .NET 10 SDK and SQL Server Express are installed.
3. Edit `appsettings.json` if your SQL Server instance is different.
4. Run:
   `dotnet restore`
   `dotnet run --urls http://localhost:5000`
5. Swagger: `http://localhost:5000/swagger`

The database is created automatically on first run using `EnsureCreated()` and seed data is inserted.

Admin login: `admin@example.com` / `Admin@123`

## Frontend setup
1. Open `frontend`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the Vite URL, normally `http://localhost:5173`.

## Reverse-engineering order
1. `Program.cs` — dependency injection, EF Core, JWT, CORS, middleware.
2. `Models/Entities.cs` — database entities/relationships.
3. `Data/AppDbContext.cs` — EF Core configuration.
4. `AuthController.cs` — register/login + password hashing + JWT.
5. `ProductsController.cs` — CRUD and `[Authorize(Roles="Admin")]`.
6. `CartController.cs` — current user from JWT claims and cart operations.
7. `OrdersController.cs` — checkout transaction-like flow, stock update, order creation.
8. React `main.jsx` — API calls, auth token, pages and routing.

Try to draw the request flow yourself:
React -> Axios -> Controller -> DbContext -> SQL Server -> Controller response -> React.
