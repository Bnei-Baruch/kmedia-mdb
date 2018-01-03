import React, {Component} from 'react';
import { Button, Transition } from 'semantic-ui-react';
import {
    ShareButtons,
    ShareCounts,
    generateShareIcon,
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TumblrShareButton,
    LivejournalShareButton,
    MailruShareButton,
} = ShareButtons;

    
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const EmailIcon = generateShareIcon('email');
const WhatsappIcon = generateShareIcon('whatsapp');

class AVShare extends Component {
    state = {visible: false};

    handleClick = () => this.setState({ visible: !this.state.visible });

    render(){
        const {visible} = this.state;
        const shareUrl = 'http://www.kab.co.il';
        const title = 'facebook title';
        const buttonSize = 46;
        return (
                <div className='social-share'>
                    <Button
                        type="button"
                        primary
                        size="big"
                        circular
                        icon={'share alternate'}
                        onClick={this.handleClick}
                    />
                    <Transition visible={visible} animation='scale' duration={500}>
                        <div className='social-buttons'>
                            <FacebookShareButton url={shareUrl} quote={title} >
                                <FacebookIcon size={buttonSize} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={shareUrl} title={title} >
                                <TwitterIcon size={buttonSize} round />
                            </TwitterShareButton>
                            <WhatsappShareButton url={shareUrl} title={title} separator=":: " >
                                <WhatsappIcon size={buttonSize} round />
                            </WhatsappShareButton>
                            <GooglePlusShareButton url={shareUrl} >
                                <GooglePlusIcon size={buttonSize} round />
                            </GooglePlusShareButton>
                            <EmailShareButton url={shareUrl} subject={title} body="body">
                                <EmailIcon size={buttonSize} round />
                            </EmailShareButton>
                        </div>
                    </Transition>
                </div>
        );
    }
}

export default AVShare;
