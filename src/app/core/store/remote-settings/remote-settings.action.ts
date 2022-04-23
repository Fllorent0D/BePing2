export class UpdateRemoteSettingKey {
    static readonly type = '[Remote settings] Update remote setting key';

    constructor(
        public key: string,
        public value: any
    ) {
    }
}

export class RefreshRemoteConfig {
    static readonly type = '[Remote settings] refresh';

    constructor() {
    }
}
