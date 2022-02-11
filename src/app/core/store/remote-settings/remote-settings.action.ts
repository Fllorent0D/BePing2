export class UpdateRemoteSettingKey {
    static readonly type = '[Remote settings] Update remote setting key';

    constructor(
        public key: string,
        public value: any
    ) {
    }
}
