import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import { Check } from "lucide-react";
import WindowControls from "@/app/(project)/(components)/WindowControls";
import type { TechStackCategory } from "@/app/(project)/(types)/other.types";

/* ---------- Component ---------- */

type TerminalProps = {
  techStackData?: TechStackCategory[];
};

const Terminal = ({ techStackData = [] }: TerminalProps) => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2 className="font-bold text-sm text-center w-full text-gray-400">Tech Stack</h2>
      </div>

      <div className="pr-1">
        <div className="techstack window-scroll mac-scrollbar">
          <p>
            <span className="font-bold">@rohitkuna % </span>
            show tech stack
          </p>

          <div className="label terminal-head-row">
            <p className="terminal-category-col">Category</p>
            <p className="terminal-tech-col">Technologies</p>
          </div>

          <ul className="content">
            {techStackData.map(({ category, items }) => (
              <li key={category} className="terminal-row">
                <div className="terminal-category-value">
                  <Check className="text-[#00A154] w-5 shrink-0" size={20} />
                  <h3 className="font-semibold text-[#00A154]">{category}</h3>
                </div>

                <p className="terminal-tech-value">{items.join(", ")}</p>
              </li>
            ))}
          </ul>

          <div className="footnote">
            <p className="flex items-center gap-3 items-center text-[#00A154]">
              <Check size={20} /> All skills loaded successfully (100%);
              <span className="terminal-cursor"></span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------- Wrapped Window ---------- */

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
