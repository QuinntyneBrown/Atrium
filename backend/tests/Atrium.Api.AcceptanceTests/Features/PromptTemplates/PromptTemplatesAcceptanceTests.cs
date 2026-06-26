using System.Net;
using System.Net.Http.Json;

namespace Atrium.Api.AcceptanceTests.Features.PromptTemplates;

[TestFixture]
public class PromptTemplatesAcceptanceTests
{
    private CustomWebApplicationFactory _factory = null!;
    private HttpClient _client = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new CustomWebApplicationFactory();
        _client = _factory.CreateClient();
    }

    [TearDown]
    public void TearDown()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [Test]
    public async Task Get_ReturnsSeededBuiltInTemplates()
    {
        var list = await _client.GetFromJsonAsync<List<PromptTemplateResponse>>("/api/prompttemplates");

        Assert.That(list, Is.Not.Null);
        var builtIns = list!.Where(t => t.IsBuiltIn).Select(t => t.Name).ToList();
        Assert.That(builtIns, Is.EquivalentTo(new[] { "CHECK", "CORRECT", "AUTHOR" }));
    }

    [Test]
    public async Task Create_ThenAppearsInList()
    {
        var post = await _client.PostAsJsonAsync("/api/prompttemplates",
            new CreateRequest("My Template", "Custom", "Do {{thing}}"));
        Assert.That(post.StatusCode, Is.EqualTo(HttpStatusCode.Created));

        var created = await post.Content.ReadFromJsonAsync<PromptTemplateResponse>();
        Assert.That(created!.IsBuiltIn, Is.False);

        var list = await _client.GetFromJsonAsync<List<PromptTemplateResponse>>("/api/prompttemplates");
        Assert.That(list!.Any(t => t.Id == created.Id && t.Name == "My Template"), Is.True);
    }

    [Test]
    public async Task Delete_BuiltIn_IsRejected()
    {
        var list = await _client.GetFromJsonAsync<List<PromptTemplateResponse>>("/api/prompttemplates");
        var builtIn = list!.First(t => t.IsBuiltIn);

        var response = await _client.DeleteAsync($"/api/prompttemplates/{builtIn.Id}");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    }

    [Test]
    public async Task Delete_Custom_RemovesIt()
    {
        var created = await (await _client.PostAsJsonAsync("/api/prompttemplates",
            new CreateRequest("Temp", "Custom", "x"))).Content.ReadFromJsonAsync<PromptTemplateResponse>();

        var delete = await _client.DeleteAsync($"/api/prompttemplates/{created!.Id}");

        Assert.That(delete.StatusCode, Is.EqualTo(HttpStatusCode.NoContent));
    }

    [Test]
    public async Task Update_BuiltIn_IsRejected()
    {
        var list = await _client.GetFromJsonAsync<List<PromptTemplateResponse>>("/api/prompttemplates");
        var builtIn = list!.First(t => t.IsBuiltIn);

        var response = await _client.PutAsJsonAsync(
            $"/api/prompttemplates/{builtIn.Id}",
            new UpdateRequest("Hacked", "Custom", "tampered"));

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    }

    [Test]
    public async Task Update_Custom_PersistsChanges()
    {
        var created = await (await _client.PostAsJsonAsync("/api/prompttemplates",
            new CreateRequest("Editable", "Custom", "v1"))).Content.ReadFromJsonAsync<PromptTemplateResponse>();

        var put = await _client.PutAsJsonAsync(
            $"/api/prompttemplates/{created!.Id}",
            new UpdateRequest("Editable v2", "Author", "v2 body {{document}}"));
        Assert.That(put.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var fetched = (await _client.GetFromJsonAsync<List<PromptTemplateResponse>>("/api/prompttemplates"))!
            .Single(t => t.Id == created.Id);
        Assert.That(fetched.Name, Is.EqualTo("Editable v2"));
        Assert.That(fetched.Mode, Is.EqualTo("Author"));
        Assert.That(fetched.Body, Is.EqualTo("v2 body {{document}}"));
    }

    private sealed record CreateRequest(string Name, string Mode, string Body);

    private sealed record UpdateRequest(string Name, string Mode, string Body);

    private sealed record PromptTemplateResponse(
        Guid Id, string Name, string Mode, string Body, bool IsBuiltIn,
        DateTimeOffset CreatedOnUtc, DateTimeOffset ModifiedOnUtc);
}
