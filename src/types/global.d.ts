export {}

declare global {
    interface Err extends Error {
        status: number
        data?: any
    }
}