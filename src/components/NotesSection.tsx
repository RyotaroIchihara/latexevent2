import image_cdcc732b1d94152bcdd8ed43c12fffceeca74363 from 'figma:asset/cdcc732b1d94152bcdd8ed43c12fffceeca74363.png';
import image_a99ce58099453b4784b4628ee557e93cf007877a from 'figma:asset/a99ce58099453b4784b4628ee557e93cf007877a.png';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export function NotesSection() {
  const rules = [
    {
      title: "非露出",
      description: "モデルは全身黒ラバースーツを着用。肌の露出はありません。",
    },
    {
      title: "ノンタッチ",
      description: "モデルへの接触は一切禁止です。",
    },
    {
      title: "最小限の会話",
      description: "撮影に必要な指示のみとし、私的な会話は控えてください。",
    },
    {
      title: "規約順守",
      description: (
        <>
          撮影者は事前の
          <Link to="/terms" className="underline">規約</Link>
          に同意の上、撮影に臨んでください。
        </>
      ),
    },
  ];

  return (
    <section className="bg-white text-black py-24">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="tracking-[0.2em] text-3xl md:text-4xl">
              IMPORTANT NOTES
            </h2>
            <p className="text-sm tracking-[0.15em] text-gray-600">
              撮影にあたっての注意事項
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {rules.map((rule, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 border border-black flex items-center justify-center rounded-none">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  <h3 className="tracking-[0.15em]">{rule.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-12">{rule.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto pt-6">
            <div className="flex flex-row gap-4 md:gap-8">
              <div className="flex-1 aspect-square min-w-0">
                <ImageWithFallback
                  src={image_a99ce58099453b4784b4628ee557e93cf007877a}
                  alt="Fashion silhouette"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex-1 aspect-square min-w-0">
                <ImageWithFallback
                  src={image_cdcc732b1d94152bcdd8ed43c12fffceeca74363}
                  alt="Abstract body sculpture"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 pt-12 border-t border-black max-w-2xl mx-auto">
            <p className="text-sm tracking-[0.15em] text-gray-600">
              本イベントは、ファッションと現代アートの視点から身体の美を探求する試みです。
            </p>
            <p className="text-sm tracking-[0.15em] text-gray-600">
              非露出・匿名性を重視し、造形美と光の表現を追求します。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
