using AuctionArena.API.Services;
using AuctionArena.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionArena.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuctionController : ControllerBase
{
    private readonly AuctionService _auctionService;

    public AuctionController(AuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null)
    {
        var auctions = await _auctionService.GetAll(search);
        return Ok(auctions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var auction = await _auctionService.GetById(id);
        if (auction == null) return NotFound();
        return Ok(auction);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateAuctionDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var auction = await _auctionService.Create(dto, userId.Value);
        return CreatedAtAction(nameof(GetById), new { id = auction.Id }, auction);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAuctionDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var auction = await _auctionService.Update(id, dto, userId.Value);
        if (auction == null) return NotFound();
        return Ok(auction);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var isAdmin = User.FindFirst("IsAdmin")?.Value == "True";
        var success = await _auctionService.Deactivate(id, userId.Value, isAdmin);
        if (!success) return NotFound();
        return NoContent();
    }

    private int? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }
}