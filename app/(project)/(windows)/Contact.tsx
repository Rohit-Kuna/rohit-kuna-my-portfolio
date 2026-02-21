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
        whatsappNumber = "",
        whatsappPrefillMessage = "Hi Rohit, would love to connect with you",
        socialLinks = [],
    } = contactContent ?? {};
    const safeWhatsappNumber = typeof whatsappNumber === "string" ? whatsappNumber : "";
    const safeWhatsappPrefillMessage = typeof whatsappPrefillMessage === "string"
        ? whatsappPrefillMessage
        : "Hi Rohit, would love to connect with you";
    const safeSocialLinks = Array.isArray(socialLinks) ? socialLinks : [];

    const sanitizedWhatsappNumber = safeWhatsappNumber.replace(/\D/g, "");
    const shouldShowWhatsapp = sanitizedWhatsappNumber.length > 0;

    return(
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2 className="font-bold text-sm text-center w-full">{windowTitle}</h2>
            </div>
            <div className="p-7 space-y-5 contact-scroll mac-scrollbar">
                {profileImage && <img src={profileImage} alt={profileAlt} className="w-20 rounded-full" />}
                <h3 className="text-xl font-semibold">{heading}</h3>
                <p>{message}</p>
                {email && (
                    <div className="flex flex-wrap items-center gap-3">
                        <a className="p-1 hover:bg-gray-200 rounded cursor-pointer" href={`mailto:${email}`}>
                            <Mail className="icon inline" />
                            {email}
                        </a>
                        {shouldShowWhatsapp && (
                            <a
                                className="p-1.5 hover:bg-gray-200 rounded cursor-pointer inline-flex items-center gap-2"
                                href={`https://wa.me/${sanitizedWhatsappNumber}?text=${encodeURIComponent(safeWhatsappPrefillMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Whatsapp me"
                            >
                                <img src="/images/whatsapp.png" alt="WhatsApp" className="size-5 object-contain" />
                                <span>Whatsapp me</span>
                            </a>
                        )}
                    </div>
                )}
                <ul className="social-cards-container">
                    {safeSocialLinks.map(({id,bg,link,icon, text})=>(
                        <li className="social-cards" key={id} style={{backgroundColor:bg}}>
                            <a className="social-card-link" href={link} target="_blank" rel="nopener noreferre" title={text}>
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
