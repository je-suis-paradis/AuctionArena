namespace AuctionArena.Models.DTOs;

public class PlaceBidDto
{
    public decimal Amount { get; set; }
}

public class BidResponseDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PlacedAt { get; set; }
    public string BidderUsername { get; set; } = string.Empty;
    public int AuctionId { get; set; }
}