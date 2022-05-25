import create from 'zustand';

interface AuctionState {
    auctions: Auction[];
    setAuctions: (auctions: Array<Auction>) => void;
    editAuction: (auction: Auction, newTitle: string, newDescription: string, newCategoryId: number, newEndDate: string, newReserve: number) => void;
    removeAuction: (auction: Auction) => void;
}

const useStore = create<AuctionState>((set) => ({
    auctions: [],
    setAuctions: (auctions: Array<Auction>) => set(() => {
        return {auctions: auctions}
    }),
    editAuction: (auction: Auction, newTitle: string, newDescription: string, newCategoryId: number, newEndDate: string, newReserve: number) => set((state) => {
        return {auctions: state.auctions.map(a => a.auctionId === auction.auctionId ?
                ({...a, title: newTitle, categoryId: newCategoryId, end_date: newEndDate, reserve: newReserve} as Auction): a)}
    }),
    removeAuction: (auction: Auction) => set((state) => {
        return {auctions: state.auctions.filter(a => a.auctionId !==
                auction.auctionId)}
    }),
}))

export const useAuctionStore = useStore;