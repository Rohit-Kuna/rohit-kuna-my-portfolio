import WindowControls from "@/app/(project)/(components)/WindowControls";
import WindowWrapper from "@/app/(project)/(hoc)/WindowWrapper";
import {Mail} from "lucide-react";
import type { ContactContent } from "@/app/(project)/(types)/other.types";

type ContactProps = {
    contactContent?: ContactContent;
};

const Contact = ({ contactContent }: ContactProps) => {
    const {
        windowTitle = "",
        profileImage = "",
        profileAlt = "",
        heading = "",
        message = "",
        email = "",
        socialLinks = [],
    } = contactContent ?? {};

    return(
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2 className="font-bold text-sm text-center w-full">{windowTitle}</h2>
            </div>
            <div className="p-7 space-y-5">
                {profileImage && <img src={profileImage} alt={profileAlt} className="w-20 rounded-full" />}
                <h3 className="text-xl font-semibold">{heading}</h3>
                <p>{message}</p>
                {email && (
                    <p><a className="p-1 hover:bg-gray-200 rounded cursor-pointer" href={`mailto:${email}`}><Mail className="icon inline"/>{email}</a></p>
                )}
                <ul className="social-cards-container">
                    {socialLinks.map(({id,bg,link,icon, text})=>(
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
