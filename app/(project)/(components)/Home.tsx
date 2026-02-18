import { locations } from "@/app/(project)/(content)/location.content";
import useLocationStore from "@/app/(project)/(store)/location";
import { useWindowStore } from "@/app/(project)/(store)/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const projects = (locations.work?.children ?? []).filter(
  (node) => node.kind === "folder"
);

const Home = () => {
    const { setActiveLocation} = useLocationStore();

    const { openWindow } = useWindowStore();
    const handleOpenProjectFinder = (project:any) =>{
        setActiveLocation(project);
        openWindow("finder");
    };

  useGSAP(() => {
    if (typeof window === "undefined") return;

    let instances: Array<{ kill: () => void }> = [];

    const init = async () => {
      const { Draggable } = await import("gsap/Draggable");
      gsap.registerPlugin(Draggable);
      instances = Draggable.create(".folder") as Array<{ kill: () => void }>;
    };

    void init();

    return () => {
      instances.forEach((instance) => instance.kill());
    };
  }, []);

  return (

    <section id="home">
      <ul className="folder-grid-container">
        {projects.map((project) => (
          <li className="folder group object" key={project.id} onClick={()=>handleOpenProjectFinder(project)}>
            <img
              src="/images/folder.png"
              alt={project.name}
              className="folder-icon"
            />
            <p className="folder-title">{project.name}</p>
          </li>
        ))}
      </ul>
    </section>

  );
};

export default Home;
