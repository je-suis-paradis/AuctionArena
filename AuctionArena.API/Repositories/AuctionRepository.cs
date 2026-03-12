namespace AuctionArena.API.Repositories;

public class AuctionRepository : IAuctionRepository
{
    private readonly AppDbContext _context;

    public AuctionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AuctionResponseDto> Create(CreateAuctionDto dto, int userId)
    {
        var auction = new Auction
        {
            Title = dto.Title,
            Description = dto.Description,
            StartingBid = dto.StartingBid,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UserId = userId
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();
        return await MapToDto(auction.Id);
    }

    public async Task<List<AuctionResponseDto>> GetAll(string? search = null)
    {
        var query = _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .Where(a => a.IsActive && a.EndDate > DateTime.UtcNow);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => a.Title.Contains(search));

        var auctions = await query.ToListAsync();
        return auctions.Select(MapAuction).ToList();
    }

    public async Task<AuctionResponseDto?> GetById(int id)
    {
        var auction = await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
                .ThenInclude(b => b.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (auction == null) return null;
        return MapAuction(auction);
    }

    public async Task<AuctionResponseDto?> Update(int id, UpdateAuctionDto dto, int userId)
    {
        var auction = await _context.Auctions
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (auction == null || auction.UserId != userId) return null;

        if (!auction.Bids.Any())
            auction.Title = dto.Title;

        auction.Description = dto.Description;

        await _context.SaveChangesAsync();
        return await MapToDto(auction.Id);
    }

    public async Task<bool> Deactivate(int id, int userId, bool isAdmin)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction == null) return false;
        if (auction.UserId != userId && !isAdmin) return false;

        auction.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<AuctionResponseDto> MapToDto(int auctionId)
    {
        var auction = await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .FirstAsync(a => a.Id == auctionId);

        return MapAuction(auction);
    }

    private AuctionResponseDto MapAuction(Auction auction)
    {
        var highestBid = auction.Bids.Any()
            ? auction.Bids.Max(b => b.Amount)
            : auction.StartingBid;

        return new AuctionResponseDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            StartingBid = auction.StartingBid,
            CurrentBid = highestBid,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            IsActive = auction.IsActive,
            SellerUsername = auction.User.Username,
            SellerId = auction.UserId,
            BidCount = auction.Bids.Count
        };
    }
}