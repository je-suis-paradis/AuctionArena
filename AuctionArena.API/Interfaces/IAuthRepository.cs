namespace AuctionAren.API.Interface;

public interface IAuthRepository
{
    Task<AuthResponseDto?> Register(RegisterDto dto);
    Task<AuthResponseDto?> login(LoginDto dto);
}