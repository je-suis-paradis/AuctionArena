AuctionArena.Models.DTOs;


namespace AuctionArena.API.Interfaces;

public interface IBidRepository
{
Task<(BidRepositoryDto? bid, string? error)> PlaceBid(int auctionId, PlaceBidDto dto, int userId);
    Task<List<BidResponsDto>> GetBidsForAuction(int auctionId);
    Task<(bool success, string? error)>WithdrawBid(int bidId, int userId);
}