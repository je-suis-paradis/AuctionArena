namespace AuctionArena.Models
{
    public class Auction
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal StartingBid { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Who created this auction?
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // All bids placed on this auction
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}