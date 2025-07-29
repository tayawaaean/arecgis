import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup } from "@mui/material"


const Terms = (props) => {

    const content = (
        <>
            <Dialog
                open={props.openTerms}
                onClose={()=>props.setOpenTems(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Terms of Use and Conditions"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>1. Acceptance of Terms and Conditions</b><br />
                        By using this application, you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms and conditions, you must not use the application.<br />

                        <br /><b>2. Use of the Application</b><br />
                        <i>2.1. Authorized Use</i><br />
                        You are authorized to use the application for personal, non-commercial use only. This authorization is subject to your compliance with these terms and conditions and does not grant you ownership or rights to the application beyond the scope of its intended use.<br />
                        <i>2.2. Usage Restrictions</i><br />
                        You agree not to:<br />
                        &#x2022; Use the application for any unlawful purpose or in violation of any local, state, national, or international law.<br />
                        &#x2022; Distribute, share, or sell the application or any content without our explicit permission.<br />
                        <br /><b>3. Data Privacy</b><br />
                        <i>3.1. Privacy Commitment</i><br />
                        We value your privacy and are committed to protecting your personal data. Our data privacy practices are governed by our Privacy Policy, which is incorporated into these terms and conditions. By using the application, you consent to our data practices as outlined in our Privacy Policy.<br />
                        <br /><b>4. User Content</b><br />
                        <i>4.1. Content Guidelines</i><br />
                        Any content you submit, post, or provide through the application, including but not limited to text, images, and other media, must not violate the rights of others, be offensive, or infringe on any applicable laws. We reserve the right to remove or block any content that violates these terms.<br />
                        <br /><b>5. User Accounts</b><br />
                        <i>5.1. Account Responsibility</i><br />
                        If the application requires user accounts, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.<br />
                        <br /><b>6. Termination</b><br />
                        <i>6.1. Termination Rights</i><br />
                        We reserve the right to suspend or terminate your access to the application, at our discretion, for any reason, including but not limited to violations of these terms.<br />
                        <br /><b>7. Changes to Terms and Conditions</b><br />
                        <i>7.1. Updates</i><br />
                        We may update these terms and conditions from time to time. The most current version will be available on the application. Your continued use of the application after any changes constitutes acceptance of the revised terms.<br />
                        <br />
                        <b>PRIVACY POLICY</b><br />
                        <br />
                        <br /><b>1. Introduction</b><br />
                        This Privacy Policy is intended to help you understand how we collect, use, and protect your personal information. By using the App, you agree to the practices described in this Privacy Policy.<br />
                        <br /><b>2. Information We Collect</b><br />
                        <i>2.1. Location Information</i><br />
                        The App collects and stores location information associated with non-commercial renewable energy systems for inventory and mapping purposes. Location data includes geographic coordinates (latitude and longitude) and may be collected when you use the App.<br />
                        <i>2.2. Renewable Energy System Information</i><br />
                        We collect and store specifications and details about non-commercial renewable energy systems, such as the type of system, capacity, and other relevant technical information.<br />
                        <i>2.3. Images</i><br />
                        The App may allow you to capture and upload images of renewable energy systems. These images are stored to enhance the inventory and visualization of renewable energy installations.<br />
                        <i>2.4. Owner Name</i><br />
                        In cases where you voluntarily provide owner information for renewable energy systems, we collect and store the owner's name.<br />
                        <br /><b>3. Use of Information</b><br />
                        <i>3.1. Inventory and Mapping</i><br />
                        The information collected, including location data and renewable energy system details, is used to create an inventory of non-commercial renewable energy systems and to provide mapping and visualization features within the App.<br />
                        <i>3.2. Enhancement of User Experience</i><br />
                        Information, such as images and specifications, may be used to improve your experience by providing a more comprehensive view of renewable energy systems.<br />
                        <i>3.3. Data Security</i><br />
                        We take measures to secure the data collected and protect it from unauthorized access or disclosure.<br />
                        <br /><b>4. Sharing of Information</b><br />
                        We do not share your personal information with third parties, except in the following situations:<br />
                        <i>4.1. Consent</i><br />
                        We may share your information with your explicit consent.<br />
                        <i>4.2. Legal Obligations</i><br />
                        We may share information if required by law or to protect our rights or the rights of other users.<br />
                        <br /><b>5. Data Retention</b><br />
                        We retain your data for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required by law.<br />
                        <br /><b>6. Your Right</b><br />
                        You have the right to access, rectify, or request the deletion of your data. If you have any concerns about your data or privacy, please contact us at the contact information below.<br />
                        <br /><b>7. Updates to this Privacy Policy</b><br />
                        We may update this Privacy Policy to reflect changes to our information practices. The revised policy will be effective when posted. We encourage you to review this policy periodically.<br />
                        <br /><b>Contact Information</b><br />
                        If you have any questions or concerns regarding the Terms of use and Conditions or Privacy Policy, please contact us at:<br />
                        Email: arec@mmsu.edu.ph<br />
                        Facebook: facebook.com/nberic.arec<br />
                        Phone: (077) 774 0013<br />
                        <br />

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>props.setOpenTerms(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </>
    )
    return content
}
export default Terms