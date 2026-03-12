using AuctionArena.Models.DTOs;

namespace AuctionArena.API.Interfaces;

public interface IAuctionRepository
{
    Task<AuctionResponseDto> Create(CreateAuctionDto dto, int userId);
    Task<List<AuctionResponseDto>> GetAll(string? search = null);
    Task<AuctionResponseDto?> GetById(int id);
    Task<AuctionResponseDto?> Update(int id, UpdateAuctionDto dto, int userId);
    Task<bool> Deactivate(int id, int userId, bool isAdmin);
}