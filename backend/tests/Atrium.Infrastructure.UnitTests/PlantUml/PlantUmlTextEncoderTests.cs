using Atrium.Infrastructure.PlantUml;

namespace Atrium.Infrastructure.UnitTests.PlantUml;

[TestFixture]
public class PlantUmlTextEncoderTests
{
    [Test]
    public void Encode_ProducesOnlyPlantUmlAlphabetCharacters()
    {
        var encoded = PlantUmlTextEncoder.Encode("@startuml\nAlice -> Bob : hello\n@enduml");

        Assert.That(encoded, Is.Not.Empty);
        Assert.That(encoded, Does.Match("^[0-9A-Za-z_-]+$"));
    }

    [Test]
    public void EncodeThenDecode_RoundTripsToOriginalSource()
    {
        const string source = "@startuml\nAlice -> Bob : hello world\nBob --> Alice : hi there\n@enduml";

        var decoded = PlantUmlTextEncoder.Decode(PlantUmlTextEncoder.Encode(source));

        Assert.That(decoded, Is.EqualTo(source));
    }

    [Test]
    public void Encode_IsDeterministic()
    {
        const string source = "@startuml\nA -> B\n@enduml";

        var first = PlantUmlTextEncoder.Encode(source);
        var second = PlantUmlTextEncoder.Encode(source);

        Assert.That(second, Is.EqualTo(first));
    }
}
