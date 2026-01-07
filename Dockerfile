# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything
COPY . ./

# Restore & Build inside the sub-folder
WORKDIR /app/ShopBackend
RUN dotnet restore
RUN dotnet publish -c Release -o out

# 2. Runtime Stage (Ye chalaega)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/ShopBackend/out .

# Start the app
ENTRYPOINT ["dotnet", "ShopBackend.dll"]
