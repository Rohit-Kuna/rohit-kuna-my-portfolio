import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import {Mail} from "lucide-react";
import type { SocialLink } from "@/app/(project)/(types)/other.types";

type ContactProps = {
    socialsData: SocialLink[];
};

const Contact = ({ socialsData }: ContactProps) => {
    return(
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2 className="font-bold text-sm text-center w-full">Contact Me</h2>
            </div>
            <div className="p-5 space-y-5">
                <img src="/images/profile-photo.png" alt="Rohit" className="w-20 rounded-full" />
                <h3 className="text-xl font-semibold">Let&apos;s Connect</h3>
                <p>Got an idea ? A bug to squash? Or just wanna talk tech? I&apos;m in.</p>
                <p ><a className="p-1 hover:bg-gray-200 rounded cursor-pointer" href="mailto:rohitkuna28@gmail.com"><Mail className="icon inline"/>rohitkuna28@gmail.com</a></p>
                <ul className="social-cards-container">
                    {socialsData.map(({id,bg,link,icon, text})=>(
                        <li className="social-cards" key={id} style={{backgroundColor:bg}}>
                            <a className="space-y-5" href={link} target="_blank" rel="nopener noreferre" title={text}>
                                <img src={icon} alt={text} className="size-5" />
                                <p className="font-semibold text-sm text-white">{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow;
