import { NativeModules } from "react-native";

const { CreateThumbnailChatVT } = NativeModules;

export const { create: createThumbnail } = CreateThumbnailChatVT;
export default CreateThumbnailChatVT;
