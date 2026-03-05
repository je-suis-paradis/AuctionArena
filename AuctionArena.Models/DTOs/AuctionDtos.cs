namespace AuctionArena.Models.DTOs;

public class CreateAuctionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingBid { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class UpdateAuctionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AuctionResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingBid { get; set; }
    public decimal CurrentBid { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public string SellerUsername { get; set; } = string.Empty;
    public int SellerId { get; set; }
    public int BidCount { get; set; }
    public bool IsOpen => DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate && IsActive;
}