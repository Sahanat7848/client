import { Component, inject } from '@angular/core';
import { AddMission } from '../../_models/add-mission';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatAnchor } from "@angular/material/button";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-mission',
  imports: [MatDialogContent, MatDialogActions, MatAnchor, FormsModule],
  templateUrl: './new-mission.html',
  styleUrl: './new-mission.scss',
})
export class NewMission {
  addMission: AddMission = {
    name: '',
    description: '',
  }
  private readonly _dialogRef = inject(MatDialogRef<NewMission>);

  onSubmit() {
    const mission = this.clean(this.addMission)
    this._dialogRef.close(mission)
  }
  private clean(addMission: AddMission) {
    return {
      name: addMission.name.trim() || 'untitle',
      description: addMission.description.trim() || undefined,
    }
  }
}
