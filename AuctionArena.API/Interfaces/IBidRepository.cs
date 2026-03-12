using AuctionArena.API;
using AuctionArena.Models;
using AuctionArena.API.Services;
using AuctionArena.Data;
using System.Text;
using AuctionArena.API.Interfaces;
using AuctionArena.API.Repositories;
AuctionArena.Models.DTOs;


namespace AuctionArena.API.Interfaces;

public interface IBidRepository
{
Task<(BidRepositoryDto? bid, string? error)> PlaceBid(int auctionId, PlaceBidDto dto, int userId);
    Task<List<BidResponsDto>> GetBidsForAuction(int auctionId);
    Task<(bool success, string? error)>WithdrawBid(int bidId, int userId);
}