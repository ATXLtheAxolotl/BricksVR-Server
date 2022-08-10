class ProfileManager {

    generateFriendCode(): string {
        return new Array(5).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36);})
    }
}