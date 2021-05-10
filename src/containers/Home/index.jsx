import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import SlotThree from "../../components/common/Slot/slotThree";
import SlotFour from "../../components/common/Slot/slotFour";
import AddressBar from "../../components/common/AddressBar";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ModalBox from "../../components/common/ModalBox";

export default function Home() {
  const userProfile = useSelector((state) => state.Auth.profile);
  const isLoading = useSelector((state) => state.Auth.isLoading);

  const iProfile = useSelector((state) => state.Page.iProfile);

  const [x3Matrix, setX3Matrix] = useState(null);
  const [x6Matrix, setX6Matrix] = useState(null);

  useEffect(() => {
    if (userProfile && !iProfile) {
      setX3Matrix(userProfile.x3Matrix);
      setX6Matrix(userProfile.x6Matrix);
    }
    if (iProfile) {
      setX3Matrix(iProfile.x3Matrix);
      setX6Matrix(iProfile.x6Matrix);
    }
  }, [userProfile, iProfile]);

  const [showDialog, setShowDialog] = useState(false);

  return isLoading ? (
    <LoadingIndicator show />
  ) : (
    <>
      <ModalBox showDialog={showDialog} setShowDialog={setShowDialog} />
      <div className="page__section">
        <div className="page__buy block buy">
          <div className="block__body buy__body">
            <div className="buy__logo">
              <img
                src={require("../../assets/images/Dondi_X3.png")}
                alt="dondi x3 program"
              />
            </div>
            <div className="buy__list row">
              {x3Matrix &&
                Object.keys(x3Matrix).map((key, id) => {
                  return (
                    <SlotThree
                      key={id}
                      data={x3Matrix[key]}
                      bigBuy={
                        !x3Matrix[key].isActive &&
                        x3Matrix[x3Matrix[key].prevSlot].isActive
                      }
                      showDialog={setShowDialog}
                    />
                  );
                })}
            </div>
          </div>
          <div className="block__foot buy__foot">
            <div className="buy__desc">
              <div className="buy__desc-list row">
                <div className="buy__desc-item">
                  <div className="buy__desc-icon">ETH</div>
                  <div className="buy__desc-title">
                    The COST OF PLATFORMS IN ETH (ETHEREUM)
                  </div>
                </div>
                <div className="buy__desc-item">
                  <div className="buy__desc-icon">
                    <i className="icon icon-reinvest icon_xs"></i>
                  </div>
                  <div className="buy__desc-title">NUMBER OF REOPENS</div>
                </div>
                <div className="buy__desc-item">
                  <div className="buy__desc-icon">
                    <i className="icon icon-partners-blue icon_xs"></i>
                  </div>
                  <div className="buy__desc-title">
                    PARTNERS ON THE PLATFORM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page__buy block buy">
          <div className="block__body buy__body">
            <div className="buy__logo">
              <img
                src={require("../../assets/images/Dondi_X6.png")}
                alt="dondi x6"
              />
            </div>
            <div className="buy__list row">
              {x6Matrix &&
                Object.keys(x6Matrix).map((key, id) => {
                  return (
                    <SlotFour
                      key={id}
                      data={x6Matrix[key]}
                      bigBuy={
                        !x6Matrix[key].isActive &&
                        x6Matrix[x6Matrix[key].prevSlot].isActive
                      }
                      showDialog={setShowDialog}
                    />
                  );
                })}
            </div>
          </div>
          <div className="block__foot buy__foot">
            <div className="buy__designations designations row">
              <div className="designations__col">
                <div className="designations__item">
                  <div className="designations__color designations__color_blue"></div>
                  <div className="designations__title">
                    PARTNER INVITED BY YOU
                  </div>
                </div>
                <div className="designations__item">
                  <div className="designations__color designations__color_blue-light"></div>
                  <div className="designations__title">OVERFLOW FROM UP</div>
                </div>
              </div>
              <div className="designations__col">
                <div className="designations__item">
                  <div className="designations__color designations__color_blue-dark"></div>
                  <div className="designations__title">BOTTOM OVERFLOW</div>
                </div>
                <div className="designations__item">
                  <div className="designations__color designations__color_pink"></div>
                  <div className="designations__title">
                    PARTNER WHO IS AHEAD OF HIS INVITER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userProfile && (
          <AddressBar
            name="Your Ethereum wallet"
            address={userProfile.address}
          />
        )}
      </div>
    </>
  );
}
