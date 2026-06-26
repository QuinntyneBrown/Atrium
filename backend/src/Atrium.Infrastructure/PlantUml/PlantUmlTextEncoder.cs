using System.IO.Compression;
using System.Text;

namespace Atrium.Infrastructure.PlantUml;

/// <summary>
/// Encodes/decodes PlantUML source to the compressed text form used in PlantUML server URLs:
/// raw DEFLATE followed by PlantUML's custom base64 alphabet. NOTE: this is deliberately NOT
/// standard base64 — the alphabet and 3-byte grouping match the PlantUML reference encoder so
/// that <c>{server}/svg/{encoded}</c> renders correctly.
/// </summary>
public static class PlantUmlTextEncoder
{
    private const string Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

    public static string Encode(string source)
    {
        var deflated = Deflate(Encoding.UTF8.GetBytes(source));
        return EncodeBytes(deflated);
    }

    public static string Decode(string encoded)
    {
        var deflated = DecodeBytes(encoded);
        return Encoding.UTF8.GetString(Inflate(deflated));
    }

    private static byte[] Deflate(byte[] data)
    {
        using var output = new MemoryStream();
        using (var deflate = new DeflateStream(output, CompressionLevel.Optimal, leaveOpen: true))
        {
            deflate.Write(data, 0, data.Length);
        }

        return output.ToArray();
    }

    private static byte[] Inflate(byte[] data)
    {
        using var input = new MemoryStream(data);
        using var deflate = new DeflateStream(input, CompressionMode.Decompress);
        using var output = new MemoryStream();
        deflate.CopyTo(output);
        return output.ToArray();
    }

    private static string EncodeBytes(byte[] data)
    {
        var builder = new StringBuilder((data.Length + 2) / 3 * 4);

        for (var i = 0; i < data.Length; i += 3)
        {
            var b1 = data[i];
            var b2 = i + 1 < data.Length ? data[i + 1] : (byte)0;
            var b3 = i + 2 < data.Length ? data[i + 2] : (byte)0;
            Append3Bytes(builder, b1, b2, b3);
        }

        return builder.ToString();
    }

    private static void Append3Bytes(StringBuilder builder, byte b1, byte b2, byte b3)
    {
        var c1 = b1 >> 2;
        var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        var c4 = b3 & 0x3F;

        builder.Append(Alphabet[c1 & 0x3F]);
        builder.Append(Alphabet[c2 & 0x3F]);
        builder.Append(Alphabet[c3 & 0x3F]);
        builder.Append(Alphabet[c4 & 0x3F]);
    }

    private static byte[] DecodeBytes(string encoded)
    {
        var output = new List<byte>(encoded.Length / 4 * 3);

        for (var i = 0; i + 3 < encoded.Length; i += 4)
        {
            var c1 = Alphabet.IndexOf(encoded[i]);
            var c2 = Alphabet.IndexOf(encoded[i + 1]);
            var c3 = Alphabet.IndexOf(encoded[i + 2]);
            var c4 = Alphabet.IndexOf(encoded[i + 3]);

            output.Add((byte)((c1 << 2) | (c2 >> 4)));
            output.Add((byte)(((c2 & 0xF) << 4) | (c3 >> 2)));
            output.Add((byte)(((c3 & 0x3) << 6) | c4));
        }

        return output.ToArray();
    }
}
