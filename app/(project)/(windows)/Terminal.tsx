import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import { techStack } from "@/app/(project)/(content)/other.content";
import { Check } from "lucide-react";
import WindowControls from "@/app/(project)/(components)/WindowControls";

/* ---------- Component ---------- */

const Terminal = () => {
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

          <div className="label">
            <p className="w-32">Category</p>
            <p>Technologies</p>
          </div>

          <ul className="content">
            {techStack.map(({ category, items }) => (
              <li key={category} className="flex items-center">
                <Check className="text-[#00A154] w-5" size={20} />
                <h3 className="font-semibold text-[#00A154] w-32 ms-5">{category}</h3>

                <ul className="flex items-center gap-3 text-gray-300">
                  {items.map((item, i) => (
                    <li key={item}>
                      {item}
                      {i < items.length - 1 ? "," : ""}
                    </li>
                  ))}
                </ul>
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
