/**
 * 游戏数据-项目设置
 */
class GameSet {
    constructor() {
        //当前播放的BGM文件
        this.nowBGMFile = "";
        //当前播放的BGS文件
        this.nowBGSFile = "";
        //当前BGM音量
        this.nowBGMVolume = 100;
        //当前BGS音量
        this.nowBGSVolume = 100;
        //当前Voice音量
        this.nowVoiceVolume = 100;

        //当前文字阅读速度
        this.textSpeed = 3;
        //当前自动阅读文字显示速度
        this.autoSpeed = 3;

        //相对音乐音量
        this.musicVolume = 100;
        //相对音效音量
        this.soundVolume = 100;
        //相对语音音量
        this.voiceVolume = 100;
    };

    // 音乐音量
    get BGMVolume() {
        return this.musicVolume;
    };
    set BGMVolume(value) {
        this.musicVolume = value;
        this.setBGMVolume(this.nowBGMVolume * (musicVolume / 100));
        this.setBGSVolume(this.nowBGSVolume * (musicVolume / 100));
    };

    // 音效音量
    get SEVolume() {
        return this.soundVolume;
    };
    set SEVolume(value) {
        this.soundVolume = value;
    };

    // 语音音量
    get VoiceVolume() {
        return this.voiceVolume;
    };
    set VoiceVolume(value) {
        this.voiceVolume = value;
    };

    /**
     * 保存设置
     */
    save() {
        let info = {
            mv : this.musicVolume,
            sv : this.soundVolume,
            voice : this.voiceVolume,
            textSpeed : this.textSpeed,
            autoSpeed : this.autoSpeed
        };
        IRWFile.SaveKV(RD.Project.key + "_gameinfo",info);
    };
    /**
     * 读取设置
     */
    load() {
        let info = IRWFile.LoadKV(RD.Project.key + "_gameinfo");
        if(info != null){
            this.musicVolume = info.mv;
            this.soundVolume = info.sv;
            this.voiceVolume = info.voice;
            this.textSpeed = info.textSpeed;
            this.autoSpeed = info.autoSpeed;
        }
    };

    /**
     * 播放BGM
     * @param file 文件
     * @param volume 音量
     */
    playBGM(file,volume){
        this.nowBGMFile = file;
        this.nowBGMVolume = volume;
        if(this.nowBGMFile.length > 0){
            IAudio.playBGM(file, parseInt(volume * (this.musicVolume / 100)));
        }
    };
    /**
     * 播放BGS
     * @param file 文件
     * @param volume 音量
     */
    playBGS(file,volume) {
        this.nowBGSFile = file;
        this.nowBGSVolume = volume;
        if(this.nowBGSFile.length > 0){
            IAudio.playBGS(file, parseInt(volume * (this.musicVolume / 100)));
        }
    };
    /**
     * 播放SE
     * @param file 文件
     * @param volume 音量
     */
    playSE(file,volume){
        IAudio.playSE(file, parseInt(volume * (this.soundVolume / 100)));
    };
    /**
     * 播放Voice
     * @param file 文件
     * @param volume 音量
     */
    playVoice(file,volume){
        IAudio.playVoice(file, parseInt(volume * (this.voiceVolume / 100)));
    };
    /**
     * 设置BGM音量
     * @param volume
     */
    setBGMVolume(volume){
        if(this.nowBGMFile.length > 0){
            IAudio.playBGM(this.nowBGMFile, parseInt(volume));
        }
    };
    /**
     * 设置BGS音量
     * @param volume
     */
    setBGSVolume(volume){
        if(this.nowBGSFile.length > 0){
            IAudio.playBGS(this.nowBGSFile, parseInt(volume));
        }
    };

    //播放确认音效
    playEnterSE(){
        if(RD.Set.setAll.enterSound.file.length < 0) return;
        this.playSE("Audio/" + RD.Set.setAll.enterSound.file , RD.Set.setAll.enterSound.volume);
    };

    //播放取消音效
    playCancelSE() {
        if(RV.NowSet.setAll.cancelSound.file.length < 0) return;
        this.playSE("Audio/" + RD.Set.setAll.cancelSound.file , RD.Set.setAll.cancelSound.volume);
    };

    //播放选择音效
    playSelectSE() {
        if(RV.NowSet.setAll.selectSound.file.length < 0) return;
        this.playSE("Audio/" + RD.Set.setAll.selectSound.file , RD.Set.setAll.selectSound.volume);
    };
}
