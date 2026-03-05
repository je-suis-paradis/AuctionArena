using AuctionArena.API.Services;
using AuctionArena.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionArena.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidController : ControllerBase
{
    private readonly BidService _bidService;

    public BidController(BidService bidService)
    {
        _bidService = bidService;
    }

    [HttpGet("auction/{auctionId}")]
    public async Task<IActionResult> GetBidsForAuction(int auctionId)
    {
        var bids = await _bidService.GetBidsForAuction(auctionId);
        return Ok(bids);
    }

    [Authorize]
    [HttpPost("auction/{auctionId}")]
    public async Task<IActionResult> PlaceBid(int auctionId, PlaceBidDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var (bid, error) = await _bidService.PlaceBid(auctionId, dto, userId.Value);
        if (error != null) return BadRequest(error);
        return Ok(bid);
    }

    [Authorize]
    [HttpDelete("{bidId}")]
    public async Task<IActionResult> WithdrawBid(int bidId)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var (success, error) = await _bidService.WithdrawBid(bidId, userId.Value);
        if (error != null) return BadRequest(error);
        return NoContent();
    }

    private int? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }
}