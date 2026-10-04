import { basePath } from "../game/config";

export function AnimatedBrand() {
  return (
    <span className="brand-candlewick" aria-hidden="true">
      {[1, 2, 3].map((frame) => (
        <span
          className={`brand-candlewick-frame brand-frame-${[
            "one",
            "two",
            "three",
          ][frame - 1]}`}
          key={frame}
          style={{
            backgroundImage: `url("${basePath}/Candlewick/candlewick${frame}.png")`,
          }}
        />
      ))}
    </span>
  );
}

