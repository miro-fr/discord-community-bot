import { Channel } from '../types/index';

export class ChannelService {
    private channels: Channel[] = [];

    createChannel(name: string, type: 'text' | 'voice'): Channel {
        const newChannel: Channel = {
            id: this.generateId(),
            name,
            type,
        };
        this.channels.push(newChannel);
        return newChannel;
    }

    deleteChannel(channelId: string): boolean {
        const index = this.channels.findIndex(channel => channel.id === channelId);
        if (index !== -1) {
            this.channels.splice(index, 1);
            return true;
        }
        return false;
    }

    listChannels(): Channel[] {
        return this.channels;
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}