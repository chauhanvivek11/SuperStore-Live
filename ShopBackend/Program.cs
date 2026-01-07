using ShopBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Services Register karein

builder.Services.AddSingleton<CartService>();
builder.Services.AddSingleton<ShopBackend.Services.OrderService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(); // Ya AddSwaggerGen agar purana version hai

// 2. CORS allow karein (Taaki Angular 4200 port se connect ho sake)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200") // Angular ka URL
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// 3. Pipeline Setup
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Ya app.UseSwagger(); app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Ye line sabse zaroori hai CORS ke liye
app.UseCors("AllowAngular");

app.UseAuthorization();

// Ye line Controllers ko activate karti hai
app.MapControllers();

app.Run();