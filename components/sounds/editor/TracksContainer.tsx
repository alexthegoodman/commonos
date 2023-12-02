import { styled } from "@mui/material";

export const TracksContainer = styled("section")(
  ({ theme }) => `
      position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
    /* background-color: #f3f3f3; */
    background-color: transparent;
  
    user-select: none;
  
    .tracksInner {
      position: relative;
  
      .trackLength {
        position: absolute;
        left: 5px;
      }
      .ticks {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        margin: 7px 0;
  
        .tick {
          display: flex;
          flex-direction: row;
          justify-content: right;
          width: 100%;
  
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            // background-color: var(--spectrum-accent-background-color-default);
            background-color: #b5b9cf;
            color: white;
            font-size: 12px;
          }
        }
      }
  
      .track {
        background-color: transparent;
        margin-bottom: 10px;
        position: relative;
  
        .trackInner {
          position: relative;
          height: 100px;
  
          .item {
            position: absolute;
            height: 100%;
            background-color: white;
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
            border-radius: 7px;
            overflow: hidden;
            cursor: pointer;
            transition: 0.2s all ease-in-out;
  
            opacity: 0.8;
  
            .leftHandle,
            .rightHandle {
              position: absolute;
              top: 0;
              width: 15px;
              height: 100%;
              background: rgba(255, 255, 255, 0.3);
            }
  
            .leftHandle {
              left: 0;
            }
  
            .rightHandle {
              right: 0;
            }
  
            .itemHandle {
              position: absolute;
              top: 0;
              left: 15px;
              width: calc(100% - 30px);
              height: 100%;
            }
  
            .ctrls {
              position: absolute;
              top: 3px;
              right: 18px;
  
              button {
                border: none;
                outline: none;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                box-shadow: none;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20px;
                height: 20px;
                color: white;
              }
            }
  
            .name {
              display: block;
              margin: 4px;
              padding: 3px;
              background: rgba(0, 0, 0, 0.2);
              width: fit-content;
              border-radius: 5px;
              color: white;
              font-size: 12px;
            }
  
            &:hover {
              box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
              transition: 0.2s all ease-in-out;
            }
          }
        }
  
        &.videoTrack {
          .trackInner {
            .item {
              width: calc(100% - 10px);
              left: 5px;
  
              // blue to  light blue gradient
              background: radial-gradient(
                50% 50% at 0% 100%,
                #02b8dc 0%,
                #00d4ff 100%
              );
            }
          }
        }
        &.zoomTrack {
          .trackInner {
            .item {
              background-color: white;
  
              // green to light green gradient
              background: radial-gradient(
                50% 50% at 0% 100%,
                #70eb40 0%,
                #81f553 100%
              );
            }
          }
        }
  
        .trackCtrls {
          position: absolute;
          top: 0;
          right: 0px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
  
          button {
            width: 25px;
            height: 25px;
            background: #73d84b;
            border: none;
            outline: none;
            border-radius: 50%;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  `
);
