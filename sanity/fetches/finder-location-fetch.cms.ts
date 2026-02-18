import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import type {
  FileNode,
  FinderNode,
  FolderNode,
  Location,
} from "@/app/(project)/(types)/location.types";

type Ref = { _ref: string };

type RawFinderFile = {
  _id: string;
  _type: "finderFile";
  name: string;
  kind: "file";
  fileType: FileNode["fileType"];
  href?: string;
  imageUrl?: string;
  subtitle?: string;
  image?: string;
  description?: string[];
  order?: number;
};

type RawFinderFolder = {
  _id: string;
  _type: "finderFolder";
  name: string;
  kind: "folder";
  children?: Ref[];
  order?: number;
};

type RawFinderLocation = {
  _id: string;
  _type: "finderLocation";
  type: string;
  name: string;
  kind: "folder";
  children?: Ref[];
  order?: number;
};

type RawFinderDocs = {
  locations: RawFinderLocation[];
  folders: RawFinderFolder[];
  files: RawFinderFile[];
};

const FINDER_DOCS_QUERY = groq`
{
  "locations": *[_type == "finderLocation"]{
    _id, _type, type, name, kind, order,
    "children": children[]{_ref}
  },
  "folders": *[_type == "finderFolder"]{
    _id, _type, name, kind, order,
    "children": children[]{_ref}
  },
  "files": *[_type == "finderFile"]{
    _id, _type, name, kind, fileType, "href": coalesce(href, pdfFile.asset->url),
    "imageUrl": imageUrl.asset->url,
    subtitle,
    "image": image.asset->url,
    description,
    order
  }
}
`;

const byOrder = <T extends { order?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const DEFAULT_FOLDER_ICON = "/images/folder.png";

const DEFAULT_FILE_ICONS: Record<FileNode["fileType"], string> = {
  txt: "/images/txt.png",
  img: "/images/image.png",
  url: "/images/safari.png",
  fig: "/images/plain.png",
  pdf: "/images/pdf.png",
};

const DEFAULT_LOCATION_ICONS: Record<string, string> = {
  work: "/icons/work.svg",
  about: "/icons/info.svg",
  resume: "/icons/file.svg",
  trash: "/icons/trash.svg",
};

const mapFile = (file: RawFinderFile): FileNode => ({
  id: file._id,
  name: file.name,
  icon: DEFAULT_FILE_ICONS[file.fileType] ?? "/images/plain.png",
  kind: "file",
  fileType: file.fileType,
  href: file.href,
  imageUrl: file.imageUrl,
  subtitle: file.subtitle,
  image: file.image,
  description: file.description,
});

export const getFinderLocationsFromSanity = async (): Promise<
  Record<string, Location>
> => {
  const data = await sanityClient.fetch<RawFinderDocs>(
    FINDER_DOCS_QUERY,
    {},
    { cache: "no-store" }
  );

  const fileMap = new Map<string, RawFinderFile>(
    (data.files ?? []).map((file) => [file._id, file])
  );
  const folderMap = new Map<string, RawFinderFolder>(
    (data.folders ?? []).map((folder) => [folder._id, folder])
  );

  const nodeCache = new Map<string, FinderNode>();

  const buildNode = (
    id: string,
    trail: Set<string> = new Set()
  ): FinderNode | null => {
    if (nodeCache.has(id)) return nodeCache.get(id) ?? null;
    if (trail.has(id)) return null;

    const file = fileMap.get(id);
    if (file) {
      const node = mapFile(file);
      nodeCache.set(id, node);
      return node;
    }

    const folder = folderMap.get(id);
    if (!folder) return null;

    const nextTrail = new Set(trail);
    nextTrail.add(id);

    const children: FinderNode[] = (folder.children ?? [])
      .map((child) => buildNode(child._ref, nextTrail))
      .filter((node): node is FinderNode => Boolean(node));

    const node: FolderNode = {
      id: folder._id,
      name: folder.name,
      icon: DEFAULT_FOLDER_ICON,
      kind: "folder",
      children,
    };

    nodeCache.set(id, node);
    return node;
  };

  const mappedLocations = byOrder(data.locations ?? []).map((location) => {
    const children: FinderNode[] = (location.children ?? [])
      .map((child) => buildNode(child._ref))
      .filter((node): node is FinderNode => Boolean(node));

    const mapped: Location = {
      id: location._id,
      type: location.type,
      name: location.name,
      icon: DEFAULT_LOCATION_ICONS[location.type] ?? DEFAULT_FOLDER_ICON,
      kind: "folder",
      children,
    };

    return mapped;
  });

  return mappedLocations.reduce<Record<string, Location>>((acc, location) => {
    acc[location.type] = location;
    return acc;
  }, {});
};
