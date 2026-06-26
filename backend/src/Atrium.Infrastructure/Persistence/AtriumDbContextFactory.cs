using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Atrium.Infrastructure.Persistence;

/// <summary>
/// Design-time factory used by <c>dotnet ef</c>. Its presence means the EF tools build the
/// model directly instead of booting the API host, so startup migration runs never execute
/// during <c>migrations add</c> / <c>database update</c>.
/// </summary>
public sealed class AtriumDbContextFactory : IDesignTimeDbContextFactory<AtriumDbContext>
{
    public AtriumDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AtriumDbContext>()
            .UseSqlite("Data Source=atrium.db")
            .Options;

        return new AtriumDbContext(options);
    }
}
