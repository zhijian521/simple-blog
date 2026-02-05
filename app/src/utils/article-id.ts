const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const ID_LENGTH = 8

export function generateId(): string {
    let id = ''
    for (let i = 0; i < ID_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length)
        id += CHARACTERS[randomIndex]
    }
    return id
}

export function validateId(id: string): boolean {
    return /^[a-z0-9]{8}$/.test(id)
}
