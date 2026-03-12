# AuctionArena

Fullstack-applikation för auktionsplattform. Låter användare skapa en user, låter users skapa auktioner, lägga bud på andras, och dra tillbaka ett sistabud, medan det fortfarande är ett ledande bud.

———

## Stack

**Backend:** ASP.NET Core 10, Entity Framework Core, SQL Server, JWT  
**Frontend:** React + Vite, React Router, Axios

———

## Setup

**Förhandskrav:** .NET 10, Node.js, Docker Desktop

# 1. Starts SQL Server
docker run -e ACCEPT_EULA=Y -e SA_PASSWORD=pnutBAdmin123! \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/azure-sql-edge:latest

# 2. Klona repot
git clone https://github.com/je-suis-paradis/AuctionArena.git
cd AuctionArena

# 3. Starta backend-biten
dotnet run --project AuctionArena.API

# 4. Starta frontend-biten i nytt terminalfönster
cd auction-arena-client
npm install
npm run dev

- Frontend kör via `http://localhost:5173`
- Backend kör via `http://localhost:5147`

———

## Features

- Registrera användare och logga in med JWT auth
- Skapa auktion med start- och slutdatum
- Lägg bud, måste överstiga föregående bud med $1.00
- Auto-bid-knappen lågger ett +$1.00
- Dra tillbaka bud medan DITT bud fortfarande är högst
- Nekar bud på egna auktioner
- Sök auktioner via titel
- Avslutade auktioner sorteras ur listan automatiskt
- Budhistorik på varje auktion
- Interface + Repository-pattern för smidig data-a

———

## Amrkitektur
AuctionArena/
├── AuctionArena.API/
│   ├── Controllers/      # HTTP endpoints
│   ├── Services/         # Auth + business logic
│   ├── Interfaces/       # Repository contracts
│   ├── Repositories/     # Data access implementations
│   └── Program.cs        # App configuration
├── AuctionArena.Models/
│   ├── Auction.cs
│   ├── Bid.cs
│   ├── User.cs
│   └── DTOs/
├── AuctionArena.Data/
│   └── AppDbContext.cs
└── auction-arena-client/
    └── src/
        ├── pages/        # Register, Login, Home, CreateAuction, AuctionDetail
        ├── components/   # AuctionCard, Header
        ├── context/      # AuthContext
        └── services/     # api.js (Axios)

        ———

# Design

- Poppiga, fullt medvetet spretiga färger för att ge "thrift-store-någonstans-i-Arizona-utmed-någon-väg-mitt-i-öknen"-vibbar

- Dåligt valt typsnitt i logo-header ska fördjupa känslan av spretighet

- Även auktionsettiketterna bär med sig prislappsestetiken