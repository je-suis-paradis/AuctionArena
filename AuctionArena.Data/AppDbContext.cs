using AuctionArena.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionArena.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // ✅ Our three tables — PostResponses is GONE, Auction is IN
    public DbSet<User> Users { get; set; }
    public DbSet<Auction> Auctions { get; set; }
    public DbSet<Bid> Bids { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Bid>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bids)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Bid>()
            .HasOne(b => b.Auction)
            .WithMany(a => a.Bids)
            .HasForeignKey(b => b.AuctionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Auction>()
            .HasOne(a => a.User)
            .WithMany(u => u.Auctions)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Auction>()
            .Property(a => a.StartingBid)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Bid>()
            .Property(b => b.Amount)
            .HasPrecision(18, 2);
    }
}