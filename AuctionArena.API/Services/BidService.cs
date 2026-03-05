using AuctionArena.Data;
using AuctionArena.Models;
using AuctionArena.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AuctionArena.API.Services;

public class BidService
{
    private readonly AppDbContext _context;

    public BidService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(BidResponseDto? bid, string? error)> PlaceBid(
        int auctionId, PlaceBidDto dto, int userId)
    {
        var auction = await _context.Auctions
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == auctionId);

        if (auction == null)
            return (null, "Auction not found.");

        if (auction.UserId == userId)
            return (null, "You cannot bid on your own auction.");

        if (DateTime.UtcNow < auction.StartDate)
            return (null, "This auction has not started yet.");

        if (DateTime.UtcNow > auction.EndDate)
            return (null, "This auction has already ended.");

        if (!auction.IsActive)
            return (null, "This auction is no longer active.");

        var currentHighest = auction.Bids.Any()
            ? auction.Bids.Max(b => b.Amount)
            : auction.StartingBid;

        if (dto.Amount < currentHighest + 1.00m)
            return (null, $"Bid must be at least ${currentHighest + 1.00m:F2}.");

        var bid = new Bid
        {
            Amount = dto.Amount,
            AuctionId = auctionId,
            UserId = userId,
            PlacedAt = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        return (new BidResponseDto
        {
            Id = bid.Id,
            Amount = bid.Amount,
            PlacedAt = bid.PlacedAt,
            BidderUsername = user!.Username,
            AuctionId = bid.AuctionId
        }, null);
    }

    public async Task<List<BidResponseDto>> GetBidsForAuction(int auctionId)
    {
        return await _context.Bids
            .Include(b => b.User)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .Select(b => new BidResponseDto
            {
                Id = b.Id,
                Amount = b.Amount,
                PlacedAt = b.PlacedAt,
                BidderUsername = b.User.Username,
                AuctionId = b.AuctionId
            })
            .ToListAsync();
    }

    public async Task<(bool success, string? error)> WithdrawBid(
        int bidId, int userId)
    {
        var bid = await _context.Bids
            .Include(b => b.Auction)
            .FirstOrDefaultAsync(b => b.Id == bidId);

        if (bid == null)
            return (false, "Bid not found.");

        if (bid.UserId != userId)
            return (false, "You can only withdraw your own bids.");

        if (DateTime.UtcNow > bid.Auction.EndDate)
            return (false, "Cannot withdraw bid after auction has ended.");

        // Only highest bidder can withdraw
        var highestBid = await _context.Bids
            .Where(b => b.AuctionId == bid.AuctionId)
            .MaxAsync(b => b.Amount);

        if (bid.Amount != highestBid)
            return (false, "You can only withdraw if you are the highest bidder.");

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();

        return (true, null);
    }
}