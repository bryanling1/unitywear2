import React from 'react'
import "./svgEditor.css"
import {Fab, Collapse, IconButton, Chip} from '@material-ui/core'
import {ZoomIn, ZoomOut, HelpOutline} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';


class SvgEditor extends React.Component{

    state={
        'paths': [
            '<path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" />',
            '<path d="M 100 350 q 150 -300 300 0" stroke="blue" stroke-width="5" fill="none" />'
        ],
        'visible': [true, true],
        zooms: [100, 120, 140, 160, 200, 250, 300],
        zoomi: 0,
        alert: true
    }
   
    // componentDidMount(){
    //     if (this.props.paths) {
    //         this.setState({'paths':this.props.paths})
    //         let visible_temp = []
    //         for (let i=0; i<this.props.paths.length; i++){
    //             visible_temp.push(true)
    //         }
    //         this.setState({'visible':visible_temp})
    //         this.props.got()
    //     }
    // }

    zoomIn=()=>{
        const i = this.state.zoomi
        const zooms = this.state.zooms.length
        if (i < zooms - 1){
            this.setState({zoomi: i + 1})
        }
    }

    zoomOut=()=>{
        const i = this.state.zoomi
        if (i !== 0){
            this.setState({zoomi: i - 1})
        }
    }

    clickHandler=(e)=>{
        const el = e.target.closest("path");
        if (el && e.currentTarget.contains(el)) {
            let visible_temp = [...this.state.visible]
            const value = visible_temp[e.currentTarget.id] 
            if (value === true){
                e.target.style.opacity = 0.2;
                visible_temp[e.currentTarget.id] = false
            }else{
                e.target.style.opacity = 1;
                visible_temp[e.currentTarget.id] = true
            }      
            this.setState({'visible':visible_temp})
        }
    }

render(){
    return(
        <div className="svgEditor">
        <div className="help"  onClick={() => {this.setState({alert: true});}}>
            <HelpOutline  />
        </div>
        <div className="chips">
        <div className="chip-half">
        <Chip size="medium" label="Editor"/>
        </div>
        <div className="chip-half">
        <Chip size="medium" label="Preview" />
        </div>
        </div>
        <div className="buttons">
        <Fab size='small' aria-label="zoom-out" className="zoom-button" onClick={this.zoomOut}>
            <ZoomOut />
        </Fab>
        <Fab size='small' aria-label="zoom-in" className="zoom-button" onClick={this.zoomIn}>
            <ZoomIn />
        </Fab>
        </div>
        <div className="alert-container">
            <Collapse in={this.state.alert}>
            <Alert
            severity="info"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    this.setState({alert: false});
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            >
            <b>Click</b> on a shape in the "Editor" panel to <b>hide or show </b>it. Preview the resul in the "Preview" panel
            </Alert>
        </Collapse>
        </div>
        <div className="edit"  onClick={() => {this.setState({alert: false});}}>
        <svg  width={`${this.state.zooms[this.state.zoomi]}%`} height={`${this.state.zooms[this.state.zoomi]}%`} version="1.1" viewBox="0, 0, 400, 450">
        {
            this.state.paths.map((path, i)=>{
                return(
                    <g onClick={this.clickHandler} key={i} id={i} dangerouslySetInnerHTML={{__html: path}}>
                    </g>
                )
            })

        }
        </svg>
        </div>
        <div className="preview">
        <img className='preview-frame' src="/images/frame.png" alt="frame"/>
        <svg  width="90%" height="90%" version="1.1" viewBox="0, 0, 400, 450">
        {
            this.state.paths.map((path, i)=>{
                return(
                    <g key={i} id={i} dangerouslySetInnerHTML={{__html: this.state.visible[i] && path}}>
                    </g>
                )
            })

        }
        </svg>
        <div className="fabric-color"></div>
        </div>
        </div>
    )
}

}
export default SvgEditor